package org.kafkahq.service.mapper;

import org.kafkahq.configs.Connect;
import org.kafkahq.models.ConnectDefinition;
import org.kafkahq.service.dto.ConnectDTO;
import org.kafkahq.service.dto.CreateConnectDefinitionDTO;

import javax.inject.Singleton;

@Singleton
public class ConnectMapper {

    public ConnectDTO fromConnectToConnectDTO(Connect connect) {
        return new ConnectDTO(connect.getName(), connect.getUrl());
    }

 

}
