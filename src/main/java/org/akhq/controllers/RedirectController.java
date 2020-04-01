package org.akhq.controllers;

import io.micronaut.http.annotation.Controller;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;
import org.akhq.modules.KafkaModule;

import javax.inject.Inject;

@Secured(SecurityRule.IS_ANONYMOUS)
@Controller
public class RedirectController extends AbstractController {
    private KafkaModule kafkaModule;

    @Inject
    public RedirectController(KafkaModule kafkaModule) {
        this.kafkaModule = kafkaModule;
    }
//
//    @Get
//    public HttpResponse slash() throws URISyntaxException {
//        return HttpResponse.redirect(this.uri("/" + kafkaModule.getClustersList().get(0) + "/topic"));
//    }
//
//    @Get("${akhq.server.base-path:}")
//    public HttpResponse home() throws URISyntaxException {
//        return HttpResponse.redirect(this.uri("/" + kafkaModule.getClustersList().get(0) + "/topic"));
//    }
//
//    @Get("${akhq.server.base-path:}/{cluster:(?!login)[^/]+}")
//    public HttpResponse topic(String cluster) throws URISyntaxException {
//        return HttpResponse.redirect(this.uri("/" + cluster + "/topic"));
//    }
}
