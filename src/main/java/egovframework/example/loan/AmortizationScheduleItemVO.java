package egovframework.example.loan;

import java.util.Date;

/**
 * 상환 스케줄 항목 VO (Value Object)
 */
public class AmortizationScheduleItemVO {
    private int round;                 // 회차
    private Date paymentDate;          // 상환일
    private double monthlyPayment;     // 월 납입금 (원금 + 이자)
    private double principalPayment;   // 월 납입 원금
    private double interestPayment;    // 월 납입 이자
    private double remainingBalance;   // 남은 대출 원금 잔액
    private double monthlyTax;         // 월 자동차세
    private double monthlyEnvCharge;   // 월 환경개선부담금
    private double totalMonthlyOutflow;// 월 총 지출액 (납입금 + 세금 + 부담금)

    // Getters and Setters
    public int getRound() { return round; }
    public void setRound(int round) { this.round = round; }

    public Date getPaymentDate() { return paymentDate; }
    public void setPaymentDate(Date paymentDate) { this.paymentDate = paymentDate; }

    public double getMonthlyPayment() { return monthlyPayment; }
    public void setMonthlyPayment(double monthlyPayment) { this.monthlyPayment = monthlyPayment; }

    public double getPrincipalPayment() { return principalPayment; }
    public void setPrincipalPayment(double principalPayment) { this.principalPayment = principalPayment; }

    public double getInterestPayment() { return interestPayment; }
    public void setInterestPayment(double interestPayment) { this.interestPayment = interestPayment; }

    public double getRemainingBalance() { return remainingBalance; }
    public void setRemainingBalance(double remainingBalance) { this.remainingBalance = remainingBalance; }

    public double getMonthlyTax() { return monthlyTax; }
    public void setMonthlyTax(double monthlyTax) { this.monthlyTax = monthlyTax; }

    public double getMonthlyEnvCharge() { return monthlyEnvCharge; }
    public void setMonthlyEnvCharge(double monthlyEnvCharge) { this.monthlyEnvCharge = monthlyEnvCharge; }

    public double getTotalMonthlyOutflow() { return totalMonthlyOutflow; }
    public void setTotalMonthlyOutflow(double totalMonthlyOutflow) { this.totalMonthlyOutflow = totalMonthlyOutflow; }
}
