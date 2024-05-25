package id.my.hendisantika.springbootreactapp.repository;

import id.my.hendisantika.springbootreactapp.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by IntelliJ IDEA.
 * Project : spring-boot-react-app
 * User: hendisantika
 * Email: hendisantika@gmail.com
 * Telegram : @hendisantika34
 * Date: 25/05/24
 * Time: 09.26
 * To change this template use File | Settings | File Templates.
 */
public interface ClientRepository extends JpaRepository<Client, Long> {
}
