export class FuelTank {

    private level = 100.0;          // Percentage
    private consumptionRate = 2.5;  // Litres per minute
    private pressure = 4.5;         // Bar

    private activeFaults: Set<string> = new Set();

    simulate(): void {

        if (this.activeFaults.has("LOW_FUEL_LEVEL")) {
            // Continuously output erroneous low fuel level (< 20%) while flag is set
            this.level = 11.5 + (Math.random() - 0.5) * 1.5;
        } else {
            this.level -= Math.random() * 0.005;
            this.level = Math.max(70.0, this.level);
        }

        this.pressure += (Math.random() - 0.5) * 0.1;
        this.pressure = Math.max(4.0, Math.min(5.0, this.pressure));

    }

    setFault(faultType: string, active: boolean) {
        if (active) {
            this.activeFaults.add(faultType);
        } else {
            for (const f of Array.from(this.activeFaults)) {
                if (f === faultType || f.includes(faultType) || faultType.includes(f)) {
                    this.activeFaults.delete(f);
                }
            }
            if (this.activeFaults.size === 0) {
                this.level = 85.0;
            }
        }
    }


    clearAllFaults() {
        this.activeFaults.clear();
        this.level = 85.0;
    }



    getTelemetry() {

        return {

            level: Number(this.level.toFixed(4)),
            consumptionRate: Number(this.consumptionRate.toFixed(4)),
            pressure: Number(this.pressure.toFixed(4))

        };

    }

}