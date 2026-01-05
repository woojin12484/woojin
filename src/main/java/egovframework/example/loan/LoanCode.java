package egovframework.example.loan;

/**
 * 대출 관련 상수 및 코드 정의 클래스
 */
public class LoanCode {
    
    // 연료 타입 코드
    public static final String FUEL_TYPE_DIESEL = "diesel";
    public static final String FUEL_TYPE_GASOLINE = "gasoline";
    public static final String FUEL_TYPE_HYBRID = "hybrid";
    public static final String FUEL_TYPE_ELECTRIC = "electric";
    
    // 자동차세 기준 (cc당 세액)
    public static final int TAX_CC_LIMIT_SMALL = 1000;
    public static final int TAX_CC_LIMIT_MEDIUM = 1600;
    
    public static final int TAX_PER_CC_SMALL = 80;   // 1000cc 이하
    public static final int TAX_PER_CC_MEDIUM = 140; // 1600cc 이하
    public static final int TAX_PER_CC_LARGE = 200;  // 1600cc 초과
    
    // 지방교육세율
    public static final double EDUCATION_TAX_RATE = 0.3; // 30%
    
    private LoanCode() {
        // 인스턴스화 방지
    }
}
