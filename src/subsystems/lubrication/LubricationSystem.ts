import { VesselSubsystem } from "../../domain/VesselSubsystem";
import { VesselCommand } from "../../Commands/VesselCommand";


export class LubricationSystem implements VesselSubsystem {

    name = "lubrication";

    private oilPressure = 4.5;
    private oilTemperature = 78;
    private oilLevel = 100;
    private oilQuality = 100;

    private activeFaults: Set<string> = new Set();

    simulate(): void {

        if (this.activeFaults.has("LOW_OIL_PRESSURE")) {
            // Continuously output erroneous low oil pressure (< 3.5 bar) while flag is set
            this.oilPressure = 2.2 + (Math.random() - 0.5) * 0.4;
        } else {
            this.oilPressure += (Math.random() - 0.5) * 0.1;
            this.oilPressure = Math.max(4.0, Math.min(5.2, this.oilPressure));
        }

        this.oilTemperature += (Math.random() - 0.5) * 1.5;
        this.oilTemperature = Math.max(65, Math.min(95, this.oilTemperature));

        this.oilLevel -= Math.random() * 0.005;
        this.oilLevel = Math.max(0, this.oilLevel);

        this.oilQuality -= Math.random() * 0.001;
        this.oilQuality = Math.max(0, this.oilQuality);

    }

    handleCommand(command: VesselCommand): void {
        if (command.action === "INJECT_FAULT" && command.payload?.type) {
            this.activeFaults.add(command.payload.type as string);
        } else if (command.action === "CLEAR_FAULT") {
            const targetType = command.payload?.type as string | undefined;
            if (!targetType) {
                this.activeFaults.clear();
                this.oilPressure = 4.5;
            } else {
                for (const f of Array.from(this.activeFaults)) {
                    if (f === targetType || f.includes(targetType) || targetType.includes(f)) {
                        this.activeFaults.delete(f);
                    }
                }
                if (this.activeFaults.size === 0) {
                    this.oilPressure = 4.5;
                }
            }
        } else if (command.action === "CLEAR_FAULTS") {
            this.activeFaults.clear();
            this.oilPressure = 4.5;
        }
    }




    collectTelemetry() {


        return {

            oilPressure: Number(this.oilPressure.toFixed(4)),
            oilTemperature: Number(this.oilTemperature.toFixed(4)),
            oilLevel: Number(this.oilLevel.toFixed(4)),
            oilQuality: Number(this.oilQuality.toFixed(4))

        };

    }

}