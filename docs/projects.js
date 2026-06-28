/*
Server JSON format for projects.json:

{
    "projects": [
        {
            "name": "Project 1",
            "status": "actively",
            "url": "https://example.com/project-1"
        }
    ]
}

Allowed status values: concept, actively, frozen, canceled.
*/

async function loadProjects() {
    const container = document.getElementById("products");

    try {
        const response = await fetch("/projects.json", { cache: "no-store" });

        if (!response.ok) {
            throw new Error(`Projects request failed: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.projects)) {
            throw new Error("Projects response must contain a projects array.");
        }

        container.textContent = "";

        for (const project of data.projects) {
            const link = document.createElement("a");

            link.className = `products status-${project.status}`;
            link.href = project.url;
            link.textContent = `${icon} ${project.name}`;

            container.appendChild(link);
        }
    } catch (error) {
        console.error(error);
        const paragraph = document.createElement("p");
        paragraph.style = "color: #a0a0a0";
        paragraph.textContent = "! Projects are not available.";
        container.appendChild(paragraph);
    }
}

loadProjects();
