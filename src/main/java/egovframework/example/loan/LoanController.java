package egovframework.example.loan;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import javax.annotation.Resource;
import egovframework.rte.fdl.property.EgovPropertyService;

/**
 * 대출 컨트롤러 (Loan Controller)
 */
@Controller
public class LoanController {

    @Resource(name = "loanCalculatorService")
    private LoanCalculatorService loanCalculatorService;

    /**
     * 대출 계산 메인 요청 처리 (Main Calculation Endpoint)
     * @param loanInputVO - 대출 입력 데이터
     * @param model - ModelMap (결과 전달용)
     * @return JSP 뷰 이름
     * @throws Exception
     */
    @RequestMapping(value = "/loan/calculate.do")
    public String calculateLoan(@ModelAttribute("loanInputVO") LoanInputVO loanInputVO, ModelMap model) throws Exception {
        
        // 1. 서비스 호출 (계산 로직 수행)
        LoanSummaryVO result = loanCalculatorService.calculateEqualPrincipalAndInterest(loanInputVO);
        
        // 2. 결과를 모델에 저장
        model.addAttribute("result", result);
        
        // 3. 결과 페이지로 이동 ( /WEB-INF/jsp/loan/loanResult.jsp 매핑)
        return "loan/loanResult";
    }
}
