package egovframework.example.loan;

import java.util.List;

/**
 * 대출 결과 요약 VO (Value Object)
 */
public class LoanSummaryVO {
    private double vehiclePrice;       // 차량 가격
    private double downPayment;        // 선수금
    
    // 자동차세 요약 (연간/월간)
    private double autoTaxAnnual;      // 연간 자동차세
    private double autoTaxMonthly;     // 월 자동차세
    
    // 환경개선부담금 요약 (반기/월간)
    private double envChargeSemiAnnual;// 환경부담금 (반기)
    private double envChargeMonthly;   // 월 환경부담금
    
    private double totalInterest;      // 총 이자
    private double totalPayment;       // 총 상환 금액
    private List<AmortizationScheduleItemVO> schedule; // 상환 스케줄 리스트

    // Getters and Setters
    public double getVehiclePrice() { return vehiclePrice; }
    public void setVehiclePrice(double vehiclePrice) { this.vehiclePrice = vehiclePrice; }

    public double getDownPayment() { return downPayment; }
    public void setDownPayment(double downPayment) { this.downPayment = downPayment; }

    public double getAutoTaxAnnual() { return autoTaxAnnual; }
    public void setAutoTaxAnnual(double autoTaxAnnual) { this.autoTaxAnnual = autoTaxAnnual; }

    public double getAutoTaxMonthly() { return autoTaxMonthly; }
    public void setAutoTaxMonthly(double autoTaxMonthly) { this.autoTaxMonthly = autoTaxMonthly; }

    public double getEnvChargeSemiAnnual() { return envChargeSemiAnnual; }
    public void setEnvChargeSemiAnnual(double envChargeSemiAnnual) { this.envChargeSemiAnnual = envChargeSemiAnnual; }

    public double getEnvChargeMonthly() { return envChargeMonthly; }
    public void setEnvChargeMonthly(double envChargeMonthly) { this.envChargeMonthly = envChargeMonthly; }

    public double getTotalInterest() { return totalInterest; }
    public void setTotalInterest(double totalInterest) { this.totalInterest = totalInterest; }

    public double getTotalPayment() { return totalPayment; }
    public void setTotalPayment(double totalPayment) { this.totalPayment = totalPayment; }

    public List<AmortizationScheduleItemVO> getSchedule() { return schedule; }
    public void setSchedule(List<AmortizationScheduleItemVO> schedule) { this.schedule = schedule; }
}
