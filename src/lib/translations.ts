export type Language = 'ko' | 'en';

export const translations = {
    ko: {
        appTitle: "woojin Capital",
        appDesc1: "가장 합리적인 자동차 금융 계획을 세워보세요.",
        appDesc2: "투명한 견적과 스마트한 상환 스케줄을 제공합니다.",
        introBtn: "소개자료 보기",
        langBtn: "English Version",
        disclaimer1: "* 본 시뮬레이션 결과는 고객님의 입력을 바탕으로 한 단순 참고용입니다.",
        disclaimer2: "* 실제 대출 실행 시점의 금리 및 금융사 정책에 따라 비용은 달라질 수 있습니다.",
        disclaimer3: "* 원리금균등분할상환 방식을 기준으로 계산됩니다.",

        // LoanInputForm
        formTitle: "우진캐피탈",
        formDesc: "대출 조건을 입력하여 상환 스케줄을 확인하세요.",
        vehiclePrice: "차량 가격",
        downPayment: "선수금",
        displacement: "배기량",
        loanPrincipal: "예상 대출 원금 (차량가 - 선수금)",
        fuelType: "연료 종류",
        fuelGasoline: "일반",
        fuelDiesel: "디젤 (경유)",
        envCharge: "환경개선부담금 (반기)",
        interestRate: "연 이자율",
        loanTerm: "대출 기간",
        startDate: "대출 실행일",
        calcBtn: "상환 스케줄 계산하기",
        saveBtn: "저장",
        alertSave: "상환 스케줄이 저장되었습니다.",
        alertError: "저장 중 오류가 발생했습니다. DB 연결을 확인해주세요.",

        // ScheduleTable
        emptyState: "조건을 입력하여 결과를 확인하세요",
        summaryPrice: "차량 가격",
        summaryInterest: "총 이자",
        summaryTax: "연간 자동차세",
        summaryTaxMonthly: "월",
        summaryEnv: "환경부담금(반기)",
        summaryTotal: "총 상환 금액",
        tableHeader: {
            round: "회차",
            date: "납입일",
            payment: "월 납입금",
            principal: "원금",
            interest: "이자",
            tax: "월 자동차세",
            env: "월 부담금",
            total: "월 총 지출",
            balance: "잔액"
        },

        // ScheduleList
        listEmpty: "저장된 상환 스케줄이 없습니다.",
        listTitle: "저장된 견적 목록",
        statusApproved: "승인완료",
        statusDraft: "작성중",
        btnEdit: "수정",
        btnApprove: "결재",
        btnDelete: "삭제",
        confirmDelete: "정말 삭제하시겠습니까?",
        confirmApprove: "이 견적을 승인하시겠습니까?",
        alertDeleteFail: "삭제 실패",
        alertApproveFail: "승인 실패"
    },
    en: {
        appTitle: "Woojin Capital",
        appDesc1: "Plan your most reasonable auto finance.",
        appDesc2: "We provide transparent estimates and smart repayment schedules.",
        introBtn: "Intro Materials",
        langBtn: "한국어 버전",
        disclaimer1: "* This simulation result is for reference only based on your input.",
        disclaimer2: "* Costs may vary depending on interest rates and financial policies at the time of execution.",
        disclaimer3: "* Calculated based on equal principal and interest repayment.",

        // LoanInputForm
        formTitle: "Woojin Capital",
        formDesc: "Enter loan conditions to check repayment schedule.",
        vehiclePrice: "Vehicle Price",
        downPayment: "Advance Payment",
        displacement: "Displacement",
        loanPrincipal: "Est. Principal (Price - Payment)",
        fuelType: "Fuel Type",
        fuelGasoline: "Gasoline",
        fuelDiesel: "Diesel",
        envCharge: "Env. Charge (Semi-annual)",
        interestRate: "Annual Rate",
        loanTerm: "Loan Term",
        startDate: "Start Date",
        calcBtn: "Calculate Schedule",
        saveBtn: "Save",
        alertSave: "Repayment schedule saved.",
        alertError: "Error saving. Please check DB connection.",

        // ScheduleTable
        emptyState: "Enter conditions to see results",
        summaryPrice: "Vehicle Price",
        summaryInterest: "Total Interest",
        summaryTax: "Annual Auto Tax",
        summaryTaxMonthly: "Monthly",
        summaryEnv: "Env. Charge (Semiannual)",
        summaryTotal: "Total Repayment",
        tableHeader: {
            round: "Round",
            date: "Date",
            payment: "Payment",
            principal: "Principal",
            interest: "Interest",
            tax: "Monthly Tax",
            env: "Monthly Charge",
            total: "Total Monthly",
            balance: "Balance"
        },

        // ScheduleList
        listEmpty: "No saved schedules.",
        listTitle: "Saved Estimates",
        statusApproved: "Approved",
        statusDraft: "Draft",
        btnEdit: "Edit",
        btnApprove: "Approve",
        btnDelete: "Delete",
        confirmDelete: "Are you sure you want to delete?",
        confirmApprove: "Do you want to approve this estimate?",
        alertDeleteFail: "Delete failed",
        alertApproveFail: "Approve failed"
    }
};
