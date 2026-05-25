 // Entry file 

 import { loadEnv } from "./env";
import { SelecetAndHello } from "./provider";

 async function main (){
    loadEnv() 
    try{
        const result = await SelecetAndHello()
        process.stdout.write(JSON.stringify(result,null,2) + "\n")
    }catch(err){
        const message= err instanceof Error?err.message :String(err)
        console.error(message)
        process.exit(1)
    }
 }

main()