export class UserMapper {
    static toUserDTO(row: any) {
        return {
            id: row.id,
            username: row.user_name,
            email: row.email,
        }
    }
}