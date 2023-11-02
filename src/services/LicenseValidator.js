import Key from "cryptolens/methods/Key.js";
import Helpers from "cryptolens/methods/Helpers.js";


class LicenseValidator{

    constructor(fileData){
        this.lic=fileData;
    }

    validateFeatures = async()=>{

        var RSAKey = this.lic.RSAPublicKey;
        var licenseKey=this.lic.licenseKey;
        var machineCode= Helpers.GetMachineCode();
        var token=  this.lic.accessToken;
        var productId = this.lic.productId;
        return await Key.Activate(token,RSAKey,productId,licenseKey,machineCode);
    }
}



export default LicenseValidator;