export const ExcelQuery = {
    importExcel: (arrData, general) => {
        const values = arrData.map(item => {
            return `('${item.name}', '${item.date}', '${item.remark}', '${general}')`;
        }).join(", ");
        return `
        INSERT INTO excel (
                name
                ,date
                ,remark
                ,general
        ) VALUES ${values}
        ON DUPLICATE KEY UPDATE remark = VALUES(remark)
                                ,general = '${general}'
        `;
    }
}