package egovframework.example.loan;

import java.util.List;

/**
 * 대출 관리 서비스 인터페이스
 */
public interface LoanManageService {
    
    /**
     * 대출 정보 저장/수정
     * @param vo
     * @throws Exception
     */
    void saveLoanSchedule(LoanManageVO vo) throws Exception;
    
    /**
     * 대출 정보 삭제
     * @param id
     * @throws Exception
     */
    void deleteLoanSchedule(String id) throws Exception;
    
    /**
     * 대출 목록 조회
     * @param vo
     * @return
     * @throws Exception
     */
    List<LoanManageVO> selectLoanScheduleList(LoanManageVO vo) throws Exception;
    
    /**
     * 대출 상세 조회
     * @param id
     * @return
     * @throws Exception
     */
    LoanManageVO selectLoanSchedule(String id) throws Exception;
    
    /**
     * 승인 처리
     * @param id
     * @throws Exception
     */
    void approveLoanSchedule(String id) throws Exception;
}
