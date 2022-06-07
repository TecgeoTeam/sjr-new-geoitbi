package com.tecgeo.geoitbibackend.master;

import java.util.Properties;

import javax.sql.DataSource;

import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.Database;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;


@Configuration
@EnableJpaRepositories(entityManagerFactoryRef = "masterEntityManagerFactory",
transactionManagerRef = "masterTransactionManager")
class MasterConfig {

	@Bean
	PlatformTransactionManager masterTransactionManager() {
		return new JpaTransactionManager(masterEntityManagerFactory().getObject());
	}

	@Bean
	LocalContainerEntityManagerFactoryBean masterEntityManagerFactory() {
		HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
		vendorAdapter.setGenerateDdl(true);
		vendorAdapter.setDatabase(Database.SQL_SERVER);
		vendorAdapter.setShowSql(true);
		LocalContainerEntityManagerFactoryBean factoryBean = new LocalContainerEntityManagerFactoryBean();
		factoryBean.setDataSource(masterDatasource());
		factoryBean.setJpaVendorAdapter(vendorAdapter);
		factoryBean.setPackagesToScan(this.getClass().getPackage().getName());
		
		Properties properties = new Properties();
		properties.setProperty("hibernate.hbm2ddl.auto", "none");
		factoryBean.setJpaProperties(properties);

		return factoryBean;
	}

	@Bean
	@ConfigurationProperties(prefix="master.spring.datasource")
	public DataSource masterDatasource() {
		return DataSourceBuilder.create().build();
	}

}
