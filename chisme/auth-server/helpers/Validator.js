import validator from "validator";

class Validator{
    /**
     * The validator library is an object not a class. So to extend the functionality of the library to our
     * custom made validator we need to point an object to the library. We now have access to all the 
     * functions and properties associated with the validator library.
     */
    static validatorMethods = {
        validator: validator
    }
    /**
     * A method where it checks if the given string will be an appropriate for any api by checking if it is empty or undefined.
     * @param {String} field A string where it will be check if it's either undefined or an empty string.
     * @returns {Boolean} Returns a boolean indicating if it passed validation.
     */
     static validateField = (field) => {
        if(field === undefined) return false;
        if(field === "") return false;
        return true;
    }
    /**
     * A method where it checks each property of an object if it meets the criteria for being consumed by an api.
     * @param {Object} fields An object that contains all the fields that we want to validate.
     */
    static validateAllFields = (fields, res) => {
        for(var property in fields){
            const isFieldValid = this.validateField(fields[property]);
            if(isFieldValid === false) return [false, property]
        }
        return [true, "passed"];
    }
}

export default Validator;