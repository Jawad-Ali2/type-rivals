import axios from "axios";

export async function saveUserData(speed, userId, token, csrfToken) {
  console.log("this function");
  const response = await axios.post(
    "http://localhost:8000/user/saveStat",
    { speed, userId },
    {
      withCredentials: true,
      headers: {
        //   "Content-Type": "application/json",  
        Authorization: `Bearer ${token}`,
        "X-CSRF-Token": csrfToken,
      },
    }
  );

  if (response.status === 200) {
    const result = await response.data;

    console.log(result);
  }
}
