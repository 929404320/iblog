// Copyright (c) poetize.cn. All rights reserved.
// 习近平：全面加强知识产权保护工作 激发创新活力推动构建新发展格局
// 项目开源版本使用AGPL v3协议，商业活动除非获得商业授权，否则无论以何种方式修改或者使用代码，都需要开源。地址：https://gitee.com/littledokey/poetize.git
// 开源不等于免费，请尊重作者劳动成果。
// 项目闭源版本及资料禁止任何未获得商业授权的网络传播和商业活动。地址：https://poetize.cn/article/20
// 项目唯一官网：https://poetize.cn

package com.ld.poetry.config;

import com.ld.poetry.handle.PoetryRuntimeException;
import lombok.SneakyThrows;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

import java.sql.*;
import java.util.HashMap;
import java.util.Map;

@Order(Ordered.LOWEST_PRECEDENCE)
public class CustomEnvironmentPostProcessor implements EnvironmentPostProcessor {

    private static final String SOURCE_NAME = "sys_config";

    private static final String SOURCE_SQL = "select * from poetize.sys_config";

    private static final String DATABASE = "poetize";

    private static final String sqlPath = "file:/home/poetize/poetry.sql";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        try {
            Map<String, Object> map = new HashMap<>();

            String username = environment.getProperty("spring.datasource.username");
            String password = environment.getProperty("spring.datasource.password");
            String url = environment.getProperty("spring.datasource.url").replace("/poetize", "");
            String driver = environment.getProperty("spring.datasource.driver-class-name");
            Class.forName(driver);
            try (Connection connection = DriverManager.getConnection(url, username, password)) {
                //初始化数据库
                initDb(connection);
                //加载配置文件
                try (Statement statement = connection.createStatement()) {
                    try (ResultSet resultSet = statement.executeQuery(SOURCE_SQL)) {
                        while (resultSet.next()) {
                            map.put(resultSet.getString("config_key"), resultSet.getString("config_value"));
                        }
                    }
                }
            }

            MutablePropertySources propertySources = environment.getPropertySources();
            PropertySource<?> source = new MapPropertySource(SOURCE_NAME, map);
            propertySources.addFirst(source);
        } catch (Exception e) {
            throw new PoetryRuntimeException(e);
        }
    }

    @SneakyThrows
    private void initDb(Connection connection) {
        try (Statement statement = connection.createStatement()) {
            try (ResultSet resultSet = statement.executeQuery("SHOW DATABASES LIKE '" + DATABASE + "'")) {
                if (!resultSet.next()) {
                    ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
                    ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
                    populator.addScripts(resolver.getResources(sqlPath));
                    populator.populate(connection);
                }
            }
        }
    }
}
