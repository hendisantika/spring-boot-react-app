package id.my.hendisantika.springbootreactapp.controller;

import id.my.hendisantika.springbootreactapp.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by IntelliJ IDEA.
 * Project : spring-boot-react-app
 * User: hendisantika
 * Email: hendisantika@gmail.com
 * Telegram : @hendisantika34
 * Date: 25/05/24
 * Time: 09.27
 * To change this template use File | Settings | File Templates.
 */
@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientsController {

    private final ClientRepository clientRepository;

}
