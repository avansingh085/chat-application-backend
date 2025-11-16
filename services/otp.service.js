class OtpService{

    constructor(otpRepository) {
        this.otpRepository = otpRepository;
    }

    async generateOtp(email) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.otpRepository.saveOtp(email, otp);
        return otp;
    }

    async verifyOtp(email, otp) {
        const savedOtp = await this.otpRepository.getOtpByEmailId(email);
        if (savedOtp === otp) {
            await this.otpRepository.deleteOtp(userId);
            return true;
        }
        return false;
    }

    async resendOtp(email) {
        return this.generateOtp(email);
    }

    

}