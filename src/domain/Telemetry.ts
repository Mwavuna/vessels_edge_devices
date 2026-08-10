export interface Telemetry {

    deviceId:string;

    timestamp:string;

    subsystems:{
        [key:string]:Record<string,unknown>;
    };

}