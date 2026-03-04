export const UserQuery = {
    getAllUser: () => {
        return `SELECT  user_name
                        ,email
                        ,password
                        ,role                
                FROM    user 
                WHERE   1 = 1
       `
    },

    getMe: (email: string) => {
        return `SELECT  email
                        ,user_name
                        ,password  
                        ,role     
                        ,birthday         
                FROM    user 
                WHERE   1 = 1
                AND     email = '${email}'
       `
    },

    resgisterUser: (email, password, user_name, role, birthday) => {
        return `INSERT INTO user(email, password, user_name, role, birthday)
                VALUES
                ('${email}', '${password}', '${user_name}', '${role}', '${birthday}')
       `
    },

    getUserCondition1: (id, email) => {
        return `SELECT  email
                        ,password                
                FROM    user
                WHERE 1 = 1
                AND id = '${id}'
                AND email = '${email}'
       `
    },

    getUserCondition2: (id, email) => {
        return `SELECT  id
                        ,user_name               
                FROM    user
                WHERE 1 = 1
                AND id = '${id}'
                AND email = '${email}'
       `
    },

    getNameDailyAttendance: (name, work_date) => {
        return `SELECT  emp_nm
                        ,work_date               
                FROM    DSH_MGR.INF_SAP_DAILY_ATTENDANCE
                WHERE   1 = 1
                AND  EMP_NM = '${name}'
                AND  WORK_DATE = '${work_date}'
       `
    },

    getDeptDailyAttendance: (name, work_date) => {
        return `SELECT  dept_group
                        ,work_date               
                FROM    DSH_MGR.INF_SAP_DAILY_ATTENDANCE
                WHERE   1 = 1
                AND  EMP_NM = '${name}'
                AND  WORK_DATE = '${work_date}'
       `
    },

    getDataProduction: (work_date) => {
        return `SELECT  WORK_DATE 
                        ,FACTORY_CODE   
                        ,TOTAL_QTY
                FROM    DSH_MGR.INF_SAP_PP_PRODUCTION
                WHERE   WORK_DATE ='${work_date}'
                ORDER BY TOTAL_QTY
                `
    }

}