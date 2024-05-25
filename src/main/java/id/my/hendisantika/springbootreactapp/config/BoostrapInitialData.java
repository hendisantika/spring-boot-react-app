package id.my.hendisantika.springbootreactapp.config;

import com.github.javafaker.Faker;
import id.my.hendisantika.springbootreactapp.model.Client;
import id.my.hendisantika.springbootreactapp.repository.ClientRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Locale;

/**
 * Created by IntelliJ IDEA.
 * Project : spring-boot-react-app
 * User: hendisantika
 * Email: hendisantika@gmail.com
 * Telegram : @hendisantika34
 * Date: 25/05/24
 * Time: 09.30
 * To change this template use File | Settings | File Templates.
 */
@Component
public class BoostrapInitialData implements CommandLineRunner {

    private final ClientRepository clientRepository;
    private final Faker faker = new Faker(Locale.getDefault());

    public BoostrapInitialData(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Override
    public void run(String... args) {
        for (int i = 0; i < 10; i++) {
            clientRepository.save(new Client(faker.name().fullName(), faker.internet().emailAddress()));
        }
    }
}
