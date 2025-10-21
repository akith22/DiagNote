package com.example.backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }

    @Autowired
    private MockMvc mockMvc;


    /**
     * Business Evaluvation testing
     * @throws Exception
     */
    @Test
    public void testLoginAndPostReview() throws Exception {
        // Step 1: Login and get token
        String loginPayload = """
				    {
				        "email": "sathindu@gmail.com",
				        "password": "123456"
				    }
				""";

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginPayload))
                .andExpect(status().isOk())
                .andReturn();

    }

	@Autowired
	private MockMvc mockMvc;


	/**
	 * Business Evaluvation testing
	 * @throws Exception
	 */
	@Test
	public void testLoginAndPostReview() throws Exception {
		// Step 1: Login and get token
		String loginPayload = """
				    {
				        "email": "sathindu@gmail.com",
				        "password": "123456"
				    }
				""";

		MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(loginPayload))
				.andExpect(status().isOk())
				.andReturn();

	}

}
