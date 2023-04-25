export const REGEX_VALIDATIONS = {
    EMAIL: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,
    PHONE: /^[0-9]{10}$/
};