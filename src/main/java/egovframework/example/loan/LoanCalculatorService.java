package egovframework.example.loan;

/**
 * 대출 계산기 서비스 인터페이스
 */
public interface LoanCalculatorService {
    
    /**
     * 원리금균등분할상환 계산 및 요약 정보 생성
     * @param input 대출 입력 정보 (LoanInputVO)
     * @return 대출 결과 요약 정보 (LoanSummaryVO)
     */
    LoanSummaryVO calculateEqualPrincipalAndInterest(LoanInputVO input);
}
