async function loadAssignment(assignmentId) {
        console.log("Fetching Assignment ID:", assignmentId);
        
        try {
            const response = await fetch(`/api/assignments/${assignmentId}`);
            console.log(response);
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                document.getElementById("title").value = data.title;
                document.getElementById("description").value = data.description || '';
                document.getElementById("price").value = data.startingPrice;
                document.getElementById("subject").value = data.subject || '';
                document.getElementById("category").value = data.category || '';
                
                if (data.deadline) {
                    document.getElementById("deadline").value = new Date(data.deadline).toISOString().split('T')[0];
                }

                document.getElementById("editAssignmentForm").dataset.assignmentId = assignmentId;
                
                console.log("Form populated for:", data.title);
            }
        } catch (err) {
            console.error("Error loading assignment:", err);
            alert("Could not load assignment data.");
        }
    }

    document.getElementById("editAssignmentForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const assignmentId = e.target.dataset.assignmentId;
        if (!assignmentId) {
            alert("Please select a PDF from the list first!");
            return;
        }

        const updatedData = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            startingPrice: document.getElementById("price").value,
            subject: document.getElementById("subject").value,
            deadline: document.getElementById("deadline").value,
            category: document.getElementById("category").value
        };

        try {
            const response = await fetch(`/api/assignments/update/${assignmentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            const result = await response.json();
            if (result.success) {
                alert("Assignment updated successfully!");
                window.location.reload(); // Refresh to see changes in the list
            } else {
                alert("Update failed: " + result.message);
            }
        } catch (err) {
            console.error("Submit error:", err);
            alert("An error occurred while saving.");
        }
    });
    
    function showPdf(path) {
      document.getElementById("pdfFrame").src = path;
    }

    // Sidebar logic (keep existing)
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);

    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('sidebar-open');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('sidebar-open');
      overlay.classList.remove('active');
    });

    // -------- Avatar Hover Delay Logic --------
    const avatar = document.querySelector('.user-avatar');
    const avatarInfo = document.querySelector('.avatar-info');

    let hideTimeout;

    // Show on hover
    avatar.addEventListener('mouseenter', () => {
      clearTimeout(hideTimeout);
      avatarInfo.classList.add('show');
    });

    // Keep open if hovering inside the dropdown
    avatarInfo.addEventListener('mouseenter', () => {
      clearTimeout(hideTimeout);
    });

    // Hide after small delay when mouse leaves
    avatar.addEventListener('mouseleave', () => {
      hideTimeout = setTimeout(() => avatarInfo.classList.remove('show'), 250);
    });

    avatarInfo.addEventListener('mouseleave', () => {
      hideTimeout = setTimeout(() => avatarInfo.classList.remove('show'), 250);
    });