package egovframework.example.loan;

import java.util.List;
import javax.annotation.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoanManageController {

    @Resource(name = "loanManageService")
    private LoanManageService loanManageService;

    /**
     * 목록 조회
     */
    @RequestMapping(value = "/loan/list.do")
    public String selectLoanList(@ModelAttribute("searchVO") LoanManageVO searchVO, ModelMap model) throws Exception {
        List<LoanManageVO> list = loanManageService.selectLoanScheduleList(searchVO);
        model.addAttribute("resultList", list);
        return "loan/loanList";
    }

    /**
     * 저장 (등록/수정)
     */
    @RequestMapping(value = "/loan/save.do")
    public String saveLoan(@ModelAttribute("loanVO") LoanManageVO loanVO, ModelMap model) throws Exception {
        loanManageService.saveLoanSchedule(loanVO);
        return "redirect:/loan/list.do";
    }

    /**
     * 삭제
     */
    @RequestMapping(value = "/loan/delete.do")
    public String deleteLoan(@RequestParam("id") String id, ModelMap model) throws Exception {
        loanManageService.deleteLoanSchedule(id);
        return "redirect:/loan/list.do";
    }

    /**
     * 승인
     */
    @RequestMapping(value = "/loan/approve.do")
    public String approveLoan(@RequestParam("id") String id, ModelMap model) throws Exception {
        loanManageService.approveLoanSchedule(id);
        return "redirect:/loan/list.do";
    }
}
