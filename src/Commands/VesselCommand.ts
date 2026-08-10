export interface VesselCommand {

    vesselId:string;

    subsystem:string;

    action:string;

    payload?:Record<string,unknown>;

}