document.getElementById('add-contact-btn').addEventListener('click', function() {
    // DB에서 받아온 vCard 정보를 사용하여 vCard 데이터 생성
    const vCard = `BEGIN:VCARD
    VERSION:3.0
    FN:이원석
    TEL;TYPE=WORK,VOICE:010-3262-7680
    EMAIL:wslee@adup.kr
    END:VCARD`;

    // Blob을 생성하여 vCard 데이터를 포함
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);

    // iOS용 다운로드 처리
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const a = document.createElement('a');
            a.href = event.target.result;
            a.download = 'contact.vcf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
        reader.readAsDataURL(blob);
    } else {
        // 임시 앵커 요소를 만들어 클릭 이벤트를 트리거하여 파일 다운로드
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contact.vcf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});
// document.getElementById('add-contact-btn').addEventListener('click', function() {
//     fetch('/vcard')
//         .then(response => response.json())
//         .then(data => {
//             // DB에서 받아온 vCard 정보를 사용하여 vCard 데이터 생성
//             const vCardData = `BEGIN:VCARD
//             VERSION:3.0
//             FN:${data.full_name}
//             TEL;TYPE=WORK,VOICE:${data.phone_number}
//             EMAIL:${data.email}
//             END:VCARD`;

//             // Blob을 생성하여 vCard 데이터를 포함
//             const blob = new Blob([vCardData], { type: 'text/vcard' });
//             const url = URL.createObjectURL(blob);

//             // iOS용 다운로드 처리
//             if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
//                 const reader = new FileReader();
//                 reader.onload = function(event) {
//                     const a = document.createElement('a');
//                     a.href = event.target.result;
//                     a.download = 'contact.vcf';
//                     document.body.appendChild(a);
//                     a.click();
//                     document.body.removeChild(a);
//                 };
//                 reader.readAsDataURL(blob);
//             } else {
//                 // 임시 앵커 요소를 만들어 클릭 이벤트를 트리거하여 파일 다운로드
//                 const a = document.createElement('a');
//                 a.href = url;
//                 a.download = 'contact.vcf';
//                 document.body.appendChild(a);
//                 a.click();
//                 document.body.removeChild(a);
//                 URL.revokeObjectURL(url);
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching vCard:', error);
//         });
// });
