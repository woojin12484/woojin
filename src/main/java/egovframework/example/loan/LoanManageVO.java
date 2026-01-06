package egovframework.example.loan;

import java.util.Date;

/**
 * 대출 관리 VO (Value Object)
 * LoanInputVO를 상속받아 관리 필드(ID, 등록일, 상태)를 추가함.
 */
public class LoanManageVO extends LoanInputVO {
    private String id;          // 식별자 (UUID 등)
    private Date regDate;       // 등록일
    private String status;      // 상태 (DRAFT, APPROVED)
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public Date getRegDate() { return regDate; }
    public void setRegDate(Date regDate) { this.regDate = regDate; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
