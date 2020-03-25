package org.akhq.service;

import org.akhq.models.Config;
import org.akhq.models.LogDir;
import org.akhq.repositories.ConfigRepository;
import org.akhq.repositories.LogDirRepository;
import org.akhq.service.dto.node.ConfigDTO;
import org.akhq.service.dto.node.ConfigOperationDTO;
import org.akhq.service.dto.node.LogDTO;
import org.akhq.service.mapper.NodeMapper;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Singleton
public class NodeService {

    private NodeMapper nodeMapper;

    private ConfigRepository configRepository;

    private LogDirRepository logDirRepository;

    @Inject
    public NodeService(NodeMapper nodeMapper, ConfigRepository configRepository, LogDirRepository logDirRepository) {
        this.nodeMapper = nodeMapper;
        this.configRepository = configRepository;
        this.logDirRepository = logDirRepository;
    }

    public List<ConfigDTO> getConfigDTOList(String clusterId, Integer nodeId) throws ExecutionException, InterruptedException {
        List<Config> configList = this.configRepository.findByBroker(clusterId, nodeId);
        configList.sort((o1, o2) -> o1.isReadOnly() == o2.isReadOnly() ? 0 :
                (o1.isReadOnly() ? 1 : -1)
        );

        return configList.stream().map(config -> nodeMapper.fromConfigToConfigDTO(config)).collect(Collectors.toList());
    }

    public List<LogDTO> getLogDTOList(String clusterId, Integer nodeId) throws ExecutionException, InterruptedException {
        List<LogDir> logList = logDirRepository.findByBroker(clusterId, nodeId);

        return logList.stream().map(logDir -> nodeMapper.fromLogDirToLogDTO(logDir)).collect(Collectors.toList());
    }

    public List<ConfigDTO> updateConfigs(ConfigOperationDTO configOperation) throws Throwable {
        Map<String, String> configs = nodeMapper.convertConfigsMap(configOperation.getConfigs());
        List<Config> updated = ConfigRepository.updatedConfigs(configs, this.configRepository.findByBroker(configOperation.getClusterId(), configOperation.getNodeId()));

        if (updated.size() == 0) {
            throw new IllegalArgumentException("No config to update");
        }

        this.configRepository.updateBroker(
                configOperation.getClusterId(),
                configOperation.getNodeId(),
                updated
        );

        return updated.stream()
                .map(config -> nodeMapper.fromConfigToConfigDTO(config))
                .collect(Collectors.toList());
    }
}