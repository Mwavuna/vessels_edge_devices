import { VesselSubsystem } from "../../domain/VesselSubsystem";
import { VesselCommand } from "../../Commands/VesselCommand";


export class ElectricalSystem implements VesselSubsystem {


    name = "electrical";


    private generatorVoltage = 440;

    private generatorCurrent = 120;

    private batteryLevel = 95;

    private activeFaults: Set<string> = new Set();

    simulate(): void {

        if (this.activeFaults.has("HIGH_GENERATOR_CURRENT")) {
            // Continuously output erroneous high generator current (> 200 A) while flag is set
            this.generatorCurrent = 245 + (Math.random() - 0.5) * 10;
        } else {
            this.generatorCurrent += (Math.random() - 0.5) * 5;
            this.generatorCurrent = Math.max(80, Math.min(160, this.generatorCurrent));
        }

        if (this.activeFaults.has("LOW_BATTERY")) {
            // Continuously output erroneous low battery level (< 20%) while flag is set
            this.batteryLevel = 11 + (Math.random() - 0.5) * 2;
        } else {
            this.batteryLevel -= Math.random() * 0.005;
            this.batteryLevel = Math.max(75, this.batteryLevel);
        }

        this.generatorVoltage += (Math.random() - 0.5) * 3;
        this.generatorVoltage = Math.max(420, Math.min(460, this.generatorVoltage));

    }

    handleCommand(command: VesselCommand): void {
        if (command.action === "INJECT_FAULT" && command.payload?.type) {
            this.activeFaults.add(command.payload.type as string);
        } else if (command.action === "CLEAR_FAULT") {
            const targetType = command.payload?.type as string | undefined;
            if (!targetType) {
                this.activeFaults.clear();
                this.generatorCurrent = 120;
                this.batteryLevel = 95;
            } else {
                for (const f of Array.from(this.activeFaults)) {
                    if (f === targetType || f.includes(targetType) || targetType.includes(f)) {
                        this.activeFaults.delete(f);
                    }
                }
                if (this.activeFaults.size === 0) {
                    this.generatorCurrent = 120;
                    this.batteryLevel = 95;
                }
            }
        } else if (command.action === "CLEAR_FAULTS") {
            this.activeFaults.clear();
            this.generatorCurrent = 120;
            this.batteryLevel = 95;
        }
    }






    collectTelemetry() {


        return {

            generator: {

                voltage:
                    Number(
                        this.generatorVoltage.toFixed(1)
                    ),

                current:
                    Number(
                        this.generatorCurrent.toFixed(1)
                    )

            },


            batteryLevel:
                Number(
                    this.batteryLevel.toFixed(1)
                )

        };

    }

}