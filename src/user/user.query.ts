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

    getMe: (user_name: string) => {
        return `SELECT  user_name
                        ,password 
                        ,email  
                        ,role              
                FROM    user 
                WHERE   1 = 1
                AND     user_name = '${user_name}'
       `
    },

    resgisterUser: (user_name, password, email, role) => {
        return `INSERT INTO user(user_name, password, email, role)
                VALUES
                ('${user_name}', '${password}', '${email}', '${role}')
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

}