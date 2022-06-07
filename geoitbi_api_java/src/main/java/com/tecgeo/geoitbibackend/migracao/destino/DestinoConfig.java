package com.tecgeo.geoitbibackend.migracao.destino;

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
@EnableJpaRepositories(entityManagerFactoryRef = "destinoEntityManagerFactory",
		transactionManagerRef = "destinoTransactionManager")
class DestinoConfig {

	@Bean
	PlatformTransactionManager destinoTransactionManager() {
		return new JpaTransactionManager(destinoEntityManagerFactory().getObject());
	}

	@Bean
	LocalContainerEntityManagerFactoryBean destinoEntityManagerFactory() {

		HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
		vendorAdapter.setGenerateDdl(true);
		vendorAdapter.setDatabase(Database.SQL_SERVER);
		vendorAdapter.setShowSql(true);
		LocalContainerEntityManagerFactoryBean factoryBean = new LocalContainerEntityManagerFactoryBean();
		factoryBean.setDataSource(destinoDataSource());
		factoryBean.setJpaVendorAdapter(vendorAdapter);
		factoryBean.setPackagesToScan(this.getClass().getPackage().getName());

		Properties properties = new Properties();
		properties.setProperty("hibernate.hbm2ddl.auto", "none");
		factoryBean.setJpaProperties(properties);
		
		return factoryBean;
	}

	
	@Bean
	@ConfigurationProperties(prefix="destino.spring.datasource")
	public DataSource destinoDataSource() {
	    return DataSourceBuilder.create().build();
	}

}
