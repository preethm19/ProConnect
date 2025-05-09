function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
}

function openLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
}

function openUserLogin() {
    document.getElementById('loginModal').classList.add('hidden');
    document.getElementById('userLoginForm').classList.remove('hidden');
}

function closeUserLogin() {
    document.getElementById('userLoginForm').classList.add('hidden');
}

function openUserSignup() {
    document.getElementById('userLoginForm').classList.add('hidden');
    document.getElementById('userSignupForm').classList.remove('hidden');
}

function closeUserSignup() {
    document.getElementById('userSignupForm').classList.add('hidden');
}

function openProviderLogin() {
    document.getElementById('loginModal').classList.add('hidden');
    document.getElementById('providerLoginForm').classList.remove('hidden');
}

function closeProviderLogin() {
    document.getElementById('providerLoginForm').classList.add('hidden');
}

function openProviderSignup() {
    document.getElementById('providerLoginForm').classList.add('hidden');
    document.getElementById('providerSignupForm').classList.remove('hidden');
}

function closeProviderSignup() {
    document.getElementById('providerSignupForm').classList.add('hidden');
}

function openServiceRequest(service) {
    const modal = document.getElementById('serviceRequestModal');
    if (service) {
        document.getElementById('serviceCategory').value = service;
    }
    modal.classList.remove('hidden');
}

function closeServiceRequest() {
    document.getElementById('serviceRequestModal').classList.add('hidden');
}

function showDashboardSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
    document.getElementById('dashboardTitle').textContent = sectionId === 'userOverview' ? 'Dashboard' : sectionId.replace('user', '');
}

function closeUserDashboard() {
    document.getElementById('userDashboard').classList.add('hidden');
}

function toggleNotifications() {
    document.getElementById('notificationsPanel').classList.toggle('hidden');
}

function updateRadiusValue(value) {
    document.getElementById('radiusValue').textContent = `${value} miles`;
}

// Check if running in a browser environment before using localStorage
if (typeof window !== 'undefined' && window.localStorage) {
    // Initialize localStorage for users, providers, and user stats if not already set
    if (!localStorage.getItem('customers')) {
        localStorage.setItem('customers', JSON.stringify([]));
    }
    if (!localStorage.getItem('providers')) {
        localStorage.setItem('providers', JSON.stringify([]));
    }
    if (!localStorage.getItem('userStats')) {
        localStorage.setItem('userStats', JSON.stringify({}));
    }
    if (!localStorage.getItem('serviceRequests')) {
        localStorage.setItem('serviceRequests', JSON.stringify([]));
    }

    // Store the currently logged-in user's email
    let currentUserEmail = null;

    // Function to update dashboard stats
    function updateDashboardStats(email) {
        const userStats = JSON.parse(localStorage.getItem('userStats'));
        const stats = userStats[email] || { activeRequests: 0, completedServices: 0, favoriteProviders: 0 };
        const customers = JSON.parse(localStorage.getItem('customers'));
        const providers = JSON.parse(localStorage.getItem('providers'));
        const user = customers.find(c => c.email === email) || providers.find(p => p.email === email);
        const userName = user.name || `${user.firstName} ${user.lastName}`;

        // Update greeting
        document.querySelector('#userOverview h3').textContent = `Welcome back, ${userName}!`;

        // Update stats
        document.querySelector('#userOverview .grid > div:nth-child(1) p.text-2xl').textContent = stats.activeRequests;
        document.querySelector('#userOverview .grid > div:nth-child(2) p.text-2xl').textContent = stats.completedServices;
        document.querySelector('#userOverview .grid > div:nth-child(3) p.text-2xl').textContent = stats.favoriteProviders;

        // Update recent requests table
        const requests = JSON.parse(localStorage.getItem('serviceRequests')).filter(req => req.userEmail === email);
        const tbody = document.querySelector('#userOverview table tbody');
        tbody.innerHTML = '';
        if (requests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No recent requests</td></tr>';
        } else {
            requests.forEach(req => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                <i class="fas fa-${req.category === 'Mechanic' ? 'tools' : req.category === 'Electrician' ? 'bolt' : req.category === 'Cleaner' ? 'broom' : 'hammer'} text-indigo-600 text-sm"></i>
                            </div>
                            <div>
                                <div class="text-sm font-medium text-gray-900">${req.category}</div>
                                <div class="text-sm text-gray-500">${req.description.substring(0, 30)}...</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                                <img class="h-10 w-10 rounded-full" src="https://randomuser.me/api/portraits/men/32.jpg" alt="">
                            </div>
                            <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">Pending</div>
                                <div class="text-sm text-gray-500">Awaiting provider</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${req.date}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <a href="#" class="text-indigo-600 hover:text-indigo-900">View</a>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    }

    // Customer Login Form Submission
    document.getElementById('customerLoginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('customerEmail').value;
        const password = document.getElementById('customerPassword').value;

        const customers = JSON.parse(localStorage.getItem('customers'));
        const customer = customers.find(c => c.email === email && c.password === password);

        if (customer) {
            alert('Login successful! Welcome, ' + customer.name);
            currentUserEmail = email;
            closeUserLogin();
            document.getElementById('userDashboard').classList.remove('hidden');
            // Update dashboard with user info
            const userInfo = document.querySelector('#userDashboard .p-4.border-b .flex.items-center');
            userInfo.querySelector('p.font-medium').textContent = customer.name;
            // Initialize stats if not exist
            const userStats = JSON.parse(localStorage.getItem('userStats'));
            if (!userStats[email]) {
                userStats[email] = { activeRequests: 0, completedServices: 0, favoriteProviders: 0 };
                localStorage.setItem('userStats', JSON.stringify(userStats));
            }
            updateDashboardStats(email);
        } else {
            alert('Invalid email or password. Please try again.');
        }
    });

    // Customer Signup Form Submission
    document.getElementById('customerSignupForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const phone = document.getElementById('signupPhone').value;
        const password = document.getElementById('signupPassword').value;

        const customers = JSON.parse(localStorage.getItem('customers'));
        if (customers.find(c => c.email === email)) {
            alert('Email already registered. Please log in or use a different email.');
            return;
        }

        customers.push({ name, email, phone, password });
        localStorage.setItem('customers', JSON.stringify(customers));
        alert('Signup successful! Please log in.');
        closeUserSignup();
        openUserLogin();
    });

    // Provider Login Form Submission
    document.getElementById('providerLoginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('providerEmail').value;
        const password = document.getElementById('providerPassword').value;

        const providers = JSON.parse(localStorage.getItem('providers'));
        const provider = providers.find(p => p.email === email && p.password === password);

        if (provider) {
            alert('Login successful! Welcome, ' + provider.firstName + ' ' + provider.lastName);
            currentUserEmail = email;
            closeProviderLogin();
            document.getElementById('userDashboard').classList.remove('hidden');
            // Update dashboard with provider info
            const userInfo = document.querySelector('#userDashboard .p-4.border-b .flex.items-center');
            userInfo.querySelector('p.font-medium').textContent = provider.firstName + ' ' + provider.lastName;
            userInfo.querySelector('p.text-xs').textContent = 'Service Provider';
            // Initialize stats if not exist
            const userStats = JSON.parse(localStorage.getItem('userStats'));
            if (!userStats[email]) {
                userStats[email] = { activeRequests: 0, completedServices: 0, favoriteProviders: 0 };
                localStorage.setItem('userStats', JSON.stringify(userStats));
            }
            updateDashboardStats(email);
        } else {
            alert('Invalid email or password. Please try again.');
        }
    });

    // Provider Signup Form Submission
    document.getElementById('providerSignupForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const firstName = document.getElementById('providerFirstName').value;
        const lastName = document.getElementById('providerLastName').value;
        const email = document.getElementById('providerEmail').value;
        const phone = document.getElementById('providerPhone').value;
        const password = document.getElementById('providerPassword').value;
        const confirmPassword = document.getElementById('providerConfirmPassword').value;
        const service = document.getElementById('providerService').value;
        const otherService = document.getElementById('otherService').value;
        const experience = document.getElementById('providerExperience').value;
        const hourlyRate = document.getElementById('providerHourlyRate').value;
        const description = document.getElementById('providerDescription').value;
        const businessName = document.getElementById('providerBusinessName').value;
        const taxId = document.getElementById('providerTaxId').value;
        const address = document.getElementById('providerAddress').value;
        const city = document.getElementById('providerCity').value;
        const state = document.getElementById('providerState').value;
        const zip = document.getElementById('providerZip').value;
        const serviceRadius = document.getElementById('providerServiceRadius').value;
        const idFile = document.getElementById('providerId').files[0];
        const licenseFile = document.getElementById('providerLicense').files[0];
        const insuranceFile = document.getElementById('providerInsurance').files[0];
        const agreement = document.getElementById('providerAgreement').checked;

        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        if (!agreement) {
            alert('You must agree to the Terms of Service and Privacy Policy.');
            return;
        }

        const providers = JSON.parse(localStorage.getItem('providers'));
        if (providers.find(p => p.email === email)) {
            alert('Email already registered. Please log in or use a different email.');
            return;
        }

        const providerData = {
            firstName,
            lastName,
            email,
            phone,
            password,
            service: service === 'Other' ? otherService : service,
            experience,
            hourlyRate,
            description,
            businessName,
            taxId,
            address,
            city,
            state,
            zip,
            serviceRadius,
            kyc: {
                idFile: idFile ? idFile.name : null,
                licenseFile: licenseFile ? licenseFile.name : null,
                insuranceFile: insuranceFile ? insuranceFile.name : null
            },
            verified: false
        };

        providers.push(providerData);
        localStorage.setItem('providers', JSON.stringify(providers));
        alert('Provider signup successful! Your account is pending verification.');
        closeProviderSignup();
        openProviderLogin();
    });

    // Service Request Form Submission
    document.getElementById('serviceRequestForm').addEventListener('submit', function (e) {
        e.preventDefault();
        if (!currentUserEmail) {
            alert('Please log in to submit a service request.');
            closeServiceRequest();
            openLoginModal();
            return;
        }

        const category = document.getElementById('serviceCategory').value;
        const otherService = document.getElementById('serviceOther').value;
        const urgency = document.getElementById('serviceUrgency').value;
        const date = document.getElementById('serviceDate').value;
        const description = document.getElementById('serviceDescription').value;
        const address = document.getElementById('serviceAddress').value;
        const city = document.getElementById('serviceCity').value;
        const state = document.getElementById('serviceState').value;
        const zip = document.getElementById('serviceZip').value;
        const name = document.getElementById('serviceName').value;
        const phone = document.getElementById('servicePhone').value;
        const email = document.getElementById('serviceEmail').value;
        const contactPref = document.getElementById('serviceContactPref').value;
        const agreement = document.getElementById('serviceAgreement').checked;

        if (!agreement) {
            alert('You must agree to the Terms of Service.');
            return;
        }

        const serviceRequests = JSON.parse(localStorage.getItem('serviceRequests'));
        const requestData = {
            userEmail: currentUserEmail,
            category: category === 'Other' ? otherService : category,
            urgency,
            date,
            description,
            address,
            city,
            state,
            zip,
            name,
            phone,
            email,
            contactPref,
            status: 'Pending'
        };
        serviceRequests.push(requestData);
        localStorage.setItem('serviceRequests', JSON.stringify(serviceRequests));

        // Update user stats
        const userStats = JSON.parse(localStorage.getItem('userStats'));
        if (!userStats[currentUserEmail]) {
            userStats[currentUserEmail] = { activeRequests: 0, completedServices: 0, favoriteProviders: 0 };
        }
        userStats[currentUserEmail].activeRequests += 1;
        localStorage.setItem('userStats', JSON.stringify(userStats));

        alert('Service request submitted successfully!');
        closeServiceRequest();
        updateDashboardStats(currentUserEmail);
    });

    // Show/hide "Other" service input based on service category selection
    document.getElementById('providerService').addEventListener('change', function () {
        const otherContainer = document.getElementById('otherServiceContainer');
        otherContainer.classList.toggle('hidden', this.value !== 'Other');
    });

    // Update file input labels with selected file names
    document.getElementById('providerId').addEventListener('change', function () {
        document.getElementById('idFileName').textContent = this.files[0] ? this.files[0].name : 'No file chosen';
    });
    document.getElementById('providerLicense').addEventListener('change', function () {
        document.getElementById('licenseFileName').textContent = this.files[0] ? this.files[0].name : 'No file chosen';
    });
    document.getElementById('providerInsurance').addEventListener('change', function () {
        document.getElementById('insuranceFileName').textContent = this.files[0] ? this.files[0].name : 'No file chosen';
    });
}
