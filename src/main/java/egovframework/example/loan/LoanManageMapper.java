package egovframework.example.loan;

import java.util.List;
import egovframework.rte.psl.dataaccess.mapper.Mapper;

/**
 * 대출 관리 Mapper 인터페이스
 */
@Mapper("loanManageMapper")
public interface LoanManageMapper {
    
    /**
     * 상환 스케줄 저장 (Insert)
     * @param vo - 저장할 대출 정보
     * @throws Exception
     */
    void insertLoanSchedule(LoanManageVO vo) throws Exception;
    
    /**
     * 상환 스케줄 수정 (Update)
     * @param vo - 수정할 대출 정보
     * @throws Exception
     */
    void updateLoanSchedule(LoanManageVO vo) throws Exception;
    
    /**
     * 상환 스케줄 삭제 (Delete)
     * @param id - 삭제할 ID
     * @throws Exception
     */
    void deleteLoanSchedule(String id) throws Exception;
    
    /**
     * 상환 스케줄 목록 조회 (Select List)
     * @param vo - 검색 조건 (필요 시)
     * @return 대출 정보 목록
     * @throws Exception
     */
    List<LoanManageVO> selectLoanScheduleList(LoanManageVO vo) throws Exception;
    
    /**
     * 상환 스케줄 상세 조회 (Select Detail)
     * @param id - 조회할 ID
     * @return 대출 정보 상세
     * @throws Exception
     */
    LoanManageVO selectLoanSchedule(String id) throws Exception;
    
    /**
     * 결재 상태 변경 (Approve)
     * @param vo - ID와 변경할 상태 포함
     * @throws Exception
     */
    void updateLoanStatus(LoanManageVO vo) throws Exception;
}
