export const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isRequired = (val: any) => val !== undefined && val !== null && val !== '';
