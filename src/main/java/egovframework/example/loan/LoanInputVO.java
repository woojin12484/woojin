package egovframework.example.loan;

import java.util.Date;

/**
 * 대출 입력 정보 VO (Value Object)
 */
public class LoanInputVO {
    private double vehiclePrice;       // 차량 가격
    private double downPayment;        // 선수금
    private int engineDisplacement;    // 배기량 (cc)
    private String fuelType;           // 연료 종류 ('diesel', 'gasoline' 등)
    private double envChargeSemiAnnual;// 환경개선부담금 (반기 납부액)
    
    private double loanAmount;         // 대출 원금 (차량 가격 - 선수금)
    private double interestRate;       // 연 이자율 (%)
    private int termMonths;            // 대출 기간 (개월)
    private Date startDate;            // 대출 실행일

    // Getters and Setters
    public double getVehiclePrice() { return vehiclePrice; }
    public void setVehiclePrice(double vehiclePrice) { this.vehiclePrice = vehiclePrice; }
    
    public double getDownPayment() { return downPayment; }
    public void setDownPayment(double downPayment) { this.downPayment = downPayment; }
    
    public int getEngineDisplacement() { return engineDisplacement; }
    public void setEngineDisplacement(int engineDisplacement) { this.engineDisplacement = engineDisplacement; }
    
    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }
    
    public double getEnvChargeSemiAnnual() { return envChargeSemiAnnual; }
    public void setEnvChargeSemiAnnual(double envChargeSemiAnnual) { this.envChargeSemiAnnual = envChargeSemiAnnual; }
    
    public double getLoanAmount() { return loanAmount; }
    public void setLoanAmount(double loanAmount) { this.loanAmount = loanAmount; }
    
    public double getInterestRate() { return interestRate; }
    public void setInterestRate(double interestRate) { this.interestRate = interestRate; }
    
    public int getTermMonths() { return termMonths; }
    public void setTermMonths(int termMonths) { this.termMonths = termMonths; }
    
    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }
}
