package com.buildcon.erp;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;

public class DbInspector {
    public static void main(String[] args) {
        System.out.println("--- STARTING DATABASE SCHEMA INSPECTION ---");
        String url = "jdbc:mysql://gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/buildcon_erp?useSSL=true&sslMode=VERIFY_IDENTITY&enabledTLSProtocols=TLSv1.2,TLSv1.3";
        String user = "4VH3kSZ5tX9DuhK.root";
        String password = "bGLrEERcK1tgb6lh";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {
            
            System.out.println("Successfully connected to MySQL database!");
            
            // 1. Inspect table columns
            System.out.println("\n--- Columns in 'workers' table ---");
            try (ResultSet rs = stmt.executeQuery("SELECT * FROM workers LIMIT 1")) {
                ResultSetMetaData metaData = rs.getMetaData();
                int columnCount = metaData.getColumnCount();
                for (int i = 1; i <= columnCount; i++) {
                    System.out.printf("Column: %-25s | Type: %-15s | Nullable: %s%n",
                            metaData.getColumnName(i),
                            metaData.getColumnTypeName(i),
                            metaData.isNullable(i) == ResultSetMetaData.columnNullable ? "YES" : "NO");
                }
            }
            
            // 2. Inspect indexes/unique constraints
            System.out.println("\n--- Indexes/Unique Constraints in 'workers' table ---");
            try (ResultSet rs = conn.getMetaData().getIndexInfo(null, "buildcon_erp", "workers", false, false)) {
                while (rs.next()) {
                    System.out.printf("Index Name: %-25s | Column: %-15s | Non-Unique: %b%n",
                            rs.getString("INDEX_NAME"),
                            rs.getString("COLUMN_NAME"),
                            rs.getBoolean("NON_UNIQUE"));
                }
            }
            
            // 3. Print all rows in workers table
            System.out.println("\n--- All Rows in 'workers' table ---");
            try (ResultSet rs = stmt.executeQuery("SELECT id, worker_id, name, organization_id, verification_status FROM workers")) {
                while (rs.next()) {
                    System.out.printf("ID: %-4d | Worker ID: %-10s | Name: %-20s | Org ID: %-4d | Status: %s%n",
                            rs.getInt("id"),
                            rs.getString("worker_id"),
                            rs.getString("name"),
                            rs.getInt("organization_id"),
                            rs.getString("verification_status"));
                }
            }

            // 4. Print all rows in workforce_managers table
            System.out.println("\n--- All Rows in 'workforce_managers' table ---");
            try (ResultSet rs = stmt.executeQuery("SELECT id, username, email, organization_id FROM workforce_managers")) {
                while (rs.next()) {
                    System.out.printf("ID: %-4d | Username: %-15s | Email: %-25s | Org ID: %-4d%n",
                            rs.getInt("id"),
                            rs.getString("username"),
                            rs.getString("email"),
                            rs.getInt("organization_id"));
                }
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
