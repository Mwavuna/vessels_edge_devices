export class Engine {

    private rpm:number = 1200;

    private temperature:number = 75;

    private pressure:number = 40;

    private load:number = 60;



    private activeFaults: Set<string> = new Set();

    simulate():void {

        // simulate normal engine fluctuations

        this.rpm += this.random(-50,50);

        if (this.activeFaults.has("HIGH_ENGINE_TEMPERATURE")) {
            // Continuously output erroneous high temperature while fault flag is set
            this.temperature = 96 + this.random(-1, 2);
        } else {
            this.temperature += this.random(-2,2);
            this.temperature = this.clamp(this.temperature, 65, 80);
        }

        this.pressure += this.random(-1,1);

        this.load += this.random(-3,3);


        // keep values realistic

        this.rpm = this.clamp(this.rpm,800,1800);

        this.pressure =
            this.clamp(this.pressure,20,60);

        this.load =
            this.clamp(this.load,0,100);

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
                this.temperature = 75;
            }
        }
    }


    clearAllFaults() {
        this.activeFaults.clear();
        this.temperature = 75;
    }





    getStatus(){

        return {

              rpm: Number(this.rpm.toFixed(4)),

              temperature: Number(this.temperature.toFixed(4)),

              pressure: Number(this.pressure.toFixed(4)),

              load: Number(this.load.toFixed(4))

        };

    }



    private random(min:number,max:number){

        return Math.random()*(max-min)+min;

    }



    private clamp(
        value:number,
        min:number,
        max:number
    ){

        return Math.min(
            Math.max(value,min),
            max
        );

    }

}