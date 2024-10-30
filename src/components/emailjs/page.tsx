import emailjs from "emailjs-com";

export const sendEmail = (toName: string, taskName: string, taskDesc: string, taskAssignedUsers: []) => {
  const templateParams = {
    to_name: toName,
    task_name: taskName,
    task_description: taskDesc,
    assigned_user: taskAssignedUsers.join(", "),
  };

  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICES_ID;

  if (!serviceId) {
    console.error("Le service ID d'EmailJS n'est pas défini !");
    return;
  }

  emailjs
    .send(
      serviceId,
      "template_aavr0jl", 
      templateParams,
      "eTH_BgveG-UMwfQM9"
    )
    .then(
      (response) => {
        console.log(
          "Email envoyé avec succès !",
          response.status,
          response.text
        );
      },
      (error) => {
        console.error("Échec de l'envoi de l'email :", error);
      }
    );
};
