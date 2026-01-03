/**
 * The starting point of the application.
 *
 * @author Hilja-Maria Paananen
 * @version 1.0.0
 */

import { db } from './config/mysql_config.js'

try {
  // Test database connection 
  db.getConnection()
    .then(() => console.log('Database connected successfully'))
    .catch(err => {
      console.error('Database connection failed:', err)
      process.exitCode = 1
    })

} catch (error) {
  console.error(error)
  process.exitCode = 1
}