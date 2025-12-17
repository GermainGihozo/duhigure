// Dashboard Charts and Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initProgressChart();
    initSectorChart();
    loadRecentActivities();
    
    // Update dashboard data every 30 seconds
    setInterval(updateDashboardStats, 30000);
});

function initProgressChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    const progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Imihigo Completion Rate',
                data: [65, 70, 75, 78, 82, 85],
                borderColor: '#198754',
                backgroundColor: 'rgba(25, 135, 84, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function initSectorChart() {
    const ctx = document.getElementById('sectorChart').getContext('2d');
    const sectorChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Kibungo', 'Bumbogo', 'Other Sectors'],
            datasets: [{
                data: [156, 89, 45],
                backgroundColor: [
                    '#198754',
                    '#0d6efd',
                    '#6c757d'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateDashboardStats() {
    // In production, this would fetch real data from the server
    console.log('Updating dashboard stats...');
    
    // Simulate API call
    fetch('/api/dashboard/stats')
        .then(response => response.json())
        .then(data => {
            // Update stats cards
            document.querySelectorAll('.stats-card').forEach(card => {
                // Update with real data
            });
        })
        .catch(error => console.error('Error updating stats:', error));
}

function loadRecentActivities() {
    const activities = [
        { type: 'registration', family: 'Uwimana Family', time: '2 hours ago' },
        { type: 'imihigo_completed', family: 'Ndayisaba Family', time: '5 hours ago' },
        { type: 'verification', family: 'Mukamana Family', time: '1 day ago' },
        { type: 'registration', family: 'Habyarimana Family', time: '2 days ago' }
    ];
    
    const container = document.getElementById('recentActivities');
    if (container) {
        container.innerHTML = activities.map(activity => `
            <div class="activity-item mb-3">
                <div class="d-flex align-items-center">
                    <div class="activity-icon me-3">
                        ${getActivityIcon(activity.type)}
                    </div>
                    <div>
                        <h6 class="mb-0">${activity.family}</h6>
                        <small class="text-muted">${activity.time}</small>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function getActivityIcon(type) {
    const icons = {
        'registration': '<i class="bi bi-person-plus text-success"></i>',
        'imihigo_completed': '<i class="bi bi-check-circle text-primary"></i>',
        'verification': '<i class="bi bi-shield-check text-warning"></i>'
    };
    return icons[type] || '<i class="bi bi-info-circle text-secondary"></i>';
}

// Export dashboard data
function exportDashboardData(format = 'csv') {
    showLoading();
    
    // Simulate data export
    setTimeout(() => {
        hideLoading();
        showSuccess(`Dashboard data exported as ${format.toUpperCase()}`);
    }, 2000);
}

// Print dashboard report
function printDashboardReport() {
    const printContent = document.querySelector('main').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <div class="container mt-4">
            <h1 class="text-center">DUHIGURE Dashboard Report</h1>
            <hr>
            ${printContent}
            <div class="text-center mt-4">
                <p>Generated on: ${new Date().toLocaleString()}</p>
            </div>
        </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    location.reload();
}