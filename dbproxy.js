const express = require('express')

const router = express.Router()

const checkTable = async (tableName) => {
    let query = `SHOW TABLES LIKE '${tableName}'`

    return new Promise((resolve, reject) => {
        con.query(query, (err, results) => {
            if (err) reject(err)
            else resolve(results)
        })
    })
}

const checkCol = async (tableName, colName) => {
    let query = `select ${colName} from ${tableName}`

    return new Promise((resolve, reject) => {
        con.query(query, (err, results) => {
            if (err) resolve(false)
            else resolve(true)
        })
    })
}

const addCol = async (tableName, colName, colType) => {
    let type = '';
    if (colType == 'string') type = 'varchar(30)';
    else if (colType == 'integer') type = 'INT';
    let query = `Alter table ${tableName} add column ${colName} ${type};`

    return new Promise((resolve, reject) => {
        con.query(query, (err, results) => {
            if (err) {
                console.log(err)
                reject(err)
            }
            else {
                console.log(`${colName} added`)
                resolve(results)
            }
        })
    })
}

router.post('/ingest', (req, res) => {
    const data = req.body
    let createTableQuery = `Create Table ${data.name} (`
    data.columns.map((col) => {
        createTableQuery += `${col.name} ${col.type}`
        if (col.pk) createTableQuery += `primaryKey`
        if (col.fk) createTableQuery += `foreignKey`
        createTableQuery += ', '
    })
    createTableQuery = createTableQuery.slice(0, -2)
    createTableQuery += ');'
    con.query(createTableQuery, (err) => {
        if (err) res.status(500).json({
            message: err
        })
        else res.status(201).json({
            message: `Table ${data.name} created`
        })
    })
})

router.post('/:collection', async (req, res) => {
    try {
        const check = await checkTable(req.params.table)
        if (!check.length) res.status(400).json({
            message: "No such table exists"
        })
        else {
            const data = req.body
            insertRows = `Insert into ${req.params.table} values `
            insertRows += `(`
            await Promise.all(data.row.map(async row => {
                await Promise.all(Object.keys(row).map(async col => {
                    if (!(await checkCol(req.params.table, col))) {
                        console.log(`${col} doesnt exist`)
                        try {
                            await addCol(req.params.table,col,typeof(row[col]))
                        }
                        catch (err) {
                            return res.json({
                                message: `${col} couldnt be added`
                            })
                        }
                    }
                    console.log(`${col} exists`)
                    insertRows += `"${row[col]}",`
                }))
                insertRows = insertRows.slice(0, -1)
                insertRows += `),(`
            }))
            console.log('query comp')
            insertRows = insertRows.slice(0, -2)
            insertRows += ';'
            console.log(insertRows)
            con.query(insertRows, (err, result) => {
                if (err) res.status(500).json({
                    message: err
                })
                else res.status(201).json({
                    message: 'the rows were added'
                })
            })
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = router