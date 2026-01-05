package egovframework.example.loan;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * 대출 계산기 서비스 구현체
 */
@Service("loanCalculatorService")
public class LoanCalculatorServiceImpl implements LoanCalculatorService {

    @Override
    public LoanSummaryVO calculateEqualPrincipalAndInterest(LoanInputVO input) {
        LoanSummaryVO summary = new LoanSummaryVO(); // 결과 요약 객체 생성
        
        // 1. 기본 정보 설정
        summary.setVehiclePrice(input.getVehiclePrice()); // 차량 가격 설정
        summary.setDownPayment(input.getDownPayment());   // 선수금 설정
        
        // 2. 자동차세 계산
        int cc = input.getEngineDisplacement(); // 배기량 (cc) 가져오기
        double annualTax = 0;   // 연간 자동차세 초기화
        double monthlyTax = 0;  // 월 자동차세 초기화
        
        if (cc > 0) {
            annualTax = calculateAutoTax(cc); // 배기량에 따른 연간 자동차세 계산
            // 월 자동차세 = 연간 자동차세 / 12 (소수점 버림)
            monthlyTax = Math.floor(annualTax / 12); // 월 환산액 계산 (원단위 절사)
            summary.setAutoTaxAnnual(annualTax);   // 연간 자동차세 결과 설정
            summary.setAutoTaxMonthly(monthlyTax); // 월 자동차세 결과 설정
        }
        
        // 3. 환경개선부담금 계산 (디젤 차량만 해당)
        double semiAnnualEnvCharge = input.getEnvChargeSemiAnnual(); // 반기 납부 환경부담금 입력값
        double monthlyEnvCharge = 0; // 월 환경부담금 (반기/6) 초기화
        
        // 연료 타입이 디젤이고, 환경부담금이 0보다 큰 경우에만 계산
        if (LoanCode.FUEL_TYPE_DIESEL.equals(input.getFuelType()) && semiAnnualEnvCharge > 0) {
            // 월 환경부담금 = 반기 납부액 / 6 (소수점 버림)
            monthlyEnvCharge = Math.floor(semiAnnualEnvCharge / 6); // 월 환산액 계산
            summary.setEnvChargeSemiAnnual(semiAnnualEnvCharge); // 반기 부담금 결과 설정
            summary.setEnvChargeMonthly(monthlyEnvCharge);       // 월 부담금 결과 설정
        }
        
        // 4. 대출 금액 유효성 검사
        double loanAmount = input.getLoanAmount(); // 대출 원금 가져오기
        int termMonths = input.getTermMonths();    // 대출 기간 (개월) 가져오기
        
        // 대출 금액이나 기간이 유효하지 않은 경우 빈 스케줄 반환
        if (loanAmount <= 0 || termMonths <= 0) {
            summary.setSchedule(new ArrayList<AmortizationScheduleItemVO>()); // 빈 리스트 설정
            return summary; // 결과 반환 후 종료
        }
        
        // 5. 월 납입금 계산 (PMT)
        // 월 이자율 = (연이율 / 100) / 12개월
        double monthlyRate = (input.getInterestRate() / 100.0) / 12.0; // 월 이자율 계산
        double monthlyPayment = 0; // 월 상환금 (원금 + 이자) 변수 선언
        
        if (monthlyRate == 0) {
            // 이자율이 0일 경우: 원금 / 기간 (단순 나눗셈)
            monthlyPayment = loanAmount / termMonths;
        } else {
            // 원리금균등상환 공식: P * r * (1 + r)^n / ((1 + r)^n - 1)
            // P: 대출원금, r: 월이자율, n: 대출기간
            double pow = Math.pow(1 + monthlyRate, termMonths); // (1+r)^n 제곱값 계산
            monthlyPayment = (loanAmount * monthlyRate * pow) / (pow - 1); // 공식 적용하여 월 납입금 계산
        }
        
        // 원 단위 절사 (한국 원화 표준)
        monthlyPayment = Math.floor(monthlyPayment); // 소수점 이하 버림 처리
        
        // 6. 상환 스케줄 생성
        List<AmortizationScheduleItemVO> schedule = new ArrayList<>(); // 상환 스케줄 리스트 생성
        double currentBalance = loanAmount; // 현재 잔액 초기화 (대출 원금부터 시작)
        double totalInterest = 0; // 총 누적 이자 초기화
        
        Calendar cal = Calendar.getInstance(); // 날짜 계산을 위한 Calendar 인스턴스 생성
        if (input.getStartDate() != null) {
            cal.setTime(input.getStartDate()); // 입력받은 대출 실행일로 날짜 설정
        }
        
        // 대출 기간(개월 수)만큼 반복하여 회차별 스케줄 생성
        for (int i = 1; i <= termMonths; i++) {
            // 이번 달 이자 = 남은 원금 * 월 이자율 (소수점 버림)
            double interestPayment = Math.floor(currentBalance * monthlyRate); // 월 이자 계산
            
            // 이번 달 원금 = 월 상환금(PMT) - 이번 달 이자
            double principalPayment = monthlyPayment - interestPayment; // 월 원금 납입액 계산
            
            // 마지막 달 보정 (잔액을 모두 털어내기 위함)
            if (i == termMonths) {
                principalPayment = currentBalance; // 원금은 남은 잔액 전액
                monthlyPayment = principalPayment - interestPayment; // 월 납입금 재조정
            }
            
            currentBalance -= principalPayment; // 잔액 차감
            totalInterest += interestPayment;   // 총 이자 누적
            
            // 날짜 계산 (다음 달로 이동)
            cal.add(Calendar.MONTH, 1);
            Date paymentDate = cal.getTime(); // 계산된 날짜 가져오기
            
            // 스케줄 항목 VO 생성 및 데이터 설정
            AmortizationScheduleItemVO item = new AmortizationScheduleItemVO(); // VO 객체 생성
            item.setRound(i); // 회차 설정
            item.setPaymentDate(paymentDate); // 납입일 설정
            item.setMonthlyPayment(monthlyPayment); // 월 납입금 설정
            item.setPrincipalPayment(principalPayment); // 월 원금 설정
            item.setInterestPayment(interestPayment);   // 월 이자 설정
            item.setRemainingBalance(Math.max(0, currentBalance)); // 잔액 설정 (음수 방지)
            item.setMonthlyTax(monthlyTax); // 월 자동차세 설정
            item.setMonthlyEnvCharge(monthlyEnvCharge); // 월 환경부담금 설정
            item.setTotalMonthlyOutflow(monthlyPayment + monthlyTax + monthlyEnvCharge); // 월 총 지출액 합산 설정
            
            schedule.add(item); // 리스트에 추가
        }
        
        summary.setSchedule(schedule); // 생성된 스케줄 리스트를 요약 객체에 설정
        summary.setTotalInterest(totalInterest); // 총 이자 설정
        summary.setTotalPayment(loanAmount + totalInterest); // 총 상환 금액(원금+이자) 설정
        
        return summary; // 최종 결과 반환
    }
    
    /**
     * 자동차세 계산 로직
     */
    private double calculateAutoTax(int cc) {
        if (cc <= 0) return 0; // 배기량이 0 이하면 0원 반환
        
        int taxPerCc = 0; // cc당 세액 변수
        if (cc <= LoanCode.TAX_CC_LIMIT_SMALL) {
            taxPerCc = LoanCode.TAX_PER_CC_SMALL; // 1000cc 이하
        } else if (cc <= LoanCode.TAX_CC_LIMIT_MEDIUM) {
            taxPerCc = LoanCode.TAX_PER_CC_MEDIUM; // 1600cc 이하
        } else {
            taxPerCc = LoanCode.TAX_PER_CC_LARGE; // 1600cc 초과
        }
        
        double baseTax = cc * taxPerCc; // 기본 자동차세 계산
        double educationTax = baseTax * LoanCode.EDUCATION_TAX_RATE; // 지방교육세 (30%) 계산
        
        return Math.floor(baseTax + educationTax); // 총 자동차세 반환 (소수점 버림)
    }
}
