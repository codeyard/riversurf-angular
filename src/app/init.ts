import {AppConfigService} from "./core/services/app-config.service";

export function loadInitialData(config: AppConfigService) {
    return () => {
        return new Promise((resolve) => {
            const location = window.location.hostname;
            if (location.split(".").includes("test") || location.split(".").includes("localhost")) {
                config.setHostName("test-riversurf-springboot.azurewebsites.net");
                config.setProtocol("https://");
            } else {
                config.setHostName("test-riversurf-springboot.azurewebsites.net");
                config.setHostName("https://");
            }
            resolve('Initialized');
        });
    }
}
