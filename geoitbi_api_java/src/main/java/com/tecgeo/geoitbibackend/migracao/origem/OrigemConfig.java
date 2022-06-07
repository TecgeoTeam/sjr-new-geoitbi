package com.tecgeo.geoitbibackend.migracao.origem;

import java.util.Properties;

import javax.sql.DataSource;

import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.Database;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;


@Configuration
@EnableJpaRepositories(entityManagerFactoryRef = "origemEntityManagerFactory",
		transactionManagerRef = "origemTransactionManager")
class OrigemConfig {

	@Bean
	PlatformTransactionManager origemTransactionManager() {
		return new JpaTransactionManager(origemEntityManagerFactory().getObject());
	}

	@Bean
	@Primary
	LocalContainerEntityManagerFactoryBean origemEntityManagerFactory() {

		HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
		vendorAdapter.setGenerateDdl(true);
		vendorAdapter.setDatabase(Database.SQL_SERVER);
		vendorAdapter.setShowSql(true);
		LocalContainerEntityManagerFactoryBean factoryBean = new LocalContainerEntityManagerFactoryBean();
		factoryBean.setDataSource(origemDataSource());
		factoryBean.setJpaVendorAdapter(vendorAdapter);
		factoryBean.setPackagesToScan(this.getClass().getPackage().getName());

		Properties properties = new Properties();
		properties.setProperty("hibernate.hbm2ddl.auto", "none");
		factoryBean.setJpaProperties(properties);
		
		return factoryBean;
	}

	
	@Bean
	@Primary
	@ConfigurationProperties(prefix="origem.spring.datasource")
	public DataSource origemDataSource() {
	    return DataSourceBuilder.create().build();
	}

}
