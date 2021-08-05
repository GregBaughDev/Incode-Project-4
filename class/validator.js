class Valid {
    constructor(){
        this.nameReg = /^[A-Za-zÀ-ÖØ-öø-ÿ\-'.0-9]+$/
        this.emailReg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
        this.passReg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
    }
    nameTest(str){
        return this.nameReg.test(str)
    }
    emailTest(str){
        return this.emailReg.test(str)
    }
    passTest(str){
        return this.passReg.test(str)
    }
}

module.exports = Valid