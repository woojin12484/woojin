package egovframework.example.loan;

import java.util.List;
import java.util.UUID;
import java.util.Date;
import javax.annotation.Resource;
import org.springframework.stereotype.Service;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * 대출 관리 서비스 구현 클래스
 */
@Service("loanManageService")
public class LoanManageServiceImpl extends EgovAbstractServiceImpl implements LoanManageService {

    @Resource(name = "loanManageMapper")
    private LoanManageMapper loanManageMapper;

    @Override
    public void saveLoanSchedule(LoanManageVO vo) throws Exception {
        if (vo.getId() == null || vo.getId().isEmpty()) {
            // 신규 저장
            vo.setId(UUID.randomUUID().toString()); // 간단한 UUID 생성
            vo.setRegDate(new Date());
            if (vo.getStatus() == null) vo.setStatus("DRAFT");
            loanManageMapper.insertLoanSchedule(vo);
        } else {
            // 수정
            loanManageMapper.updateLoanSchedule(vo);
        }
    }

    @Override
    public void deleteLoanSchedule(String id) throws Exception {
        loanManageMapper.deleteLoanSchedule(id);
    }

    @Override
    public List<LoanManageVO> selectLoanScheduleList(LoanManageVO vo) throws Exception {
        return loanManageMapper.selectLoanScheduleList(vo);
    }

    @Override
    public LoanManageVO selectLoanSchedule(String id) throws Exception {
        return loanManageMapper.selectLoanSchedule(id);
    }

    @Override
    public void approveLoanSchedule(String id) throws Exception {
        LoanManageVO vo = new LoanManageVO();
        vo.setId(id);
        vo.setStatus("APPROVED");
        loanManageMapper.updateLoanStatus(vo);
    }
}
