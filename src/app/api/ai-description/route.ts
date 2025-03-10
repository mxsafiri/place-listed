import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { businessName, category, keywords } = await request.json();
    
    if (!businessName) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      );
    }
    
    // In a production environment, you would use a real AI API like OpenAI
    // Here we're simulating the AI response for demonstration purposes
    const aiGeneratedDescription = generateBusinessDescription(businessName, category, keywords);
    
    return NextResponse.json({ description: aiGeneratedDescription });
  } catch (error) {
    console.error('Error generating AI description:', error);
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 }
    );
  }
}

// Simulated AI description generator
// In production, replace this with a call to an actual AI API
function generateBusinessDescription(businessName: string, category: string = '', keywords: string = '') {
  const categoryDescriptions: Record<string, string> = {
    'restaurant': `${businessName} is a welcoming restaurant that offers a delightful culinary experience. Our carefully crafted menu features a variety of dishes made with fresh, locally-sourced ingredients. Whether you're looking for a casual lunch spot or a place for a special dinner, our attentive staff and cozy atmosphere make every visit memorable.`,
    'retail': `${businessName} is a premier retail destination offering a curated selection of high-quality products. Our store is designed to provide a seamless shopping experience, with knowledgeable staff ready to assist you in finding exactly what you need. We pride ourselves on our exceptional customer service and commitment to bringing you the best merchandise.`,
    'service': `${businessName} provides professional services tailored to meet your specific needs. Our experienced team is dedicated to delivering exceptional results with attention to detail and personalized care. We understand the importance of reliability and quality, which is why we continuously strive to exceed your expectations.`,
    'health': `${businessName} is dedicated to promoting wellness and improving quality of life. Our health and wellness center offers a range of services designed to support your physical and mental well-being. Our team of certified professionals is committed to providing personalized care in a comfortable and supportive environment.`,
    'education': `${businessName} is an educational institution committed to fostering learning and growth. We provide a supportive environment where students can develop their skills and knowledge under the guidance of experienced educators. Our curriculum is designed to be engaging, challenging, and relevant to today's world.`,
    'entertainment': `${businessName} offers exciting entertainment options for people of all ages. Whether you're looking for a fun night out, a family-friendly activity, or a unique experience, we have something for everyone. Our venue is designed to create memorable moments and bring joy to our visitors.`,
    'hospitality': `${businessName} welcomes guests with warm hospitality and exceptional service. Our establishment is designed to provide a comfortable and enjoyable experience, with attention to every detail. Whether you're staying for business or pleasure, our dedicated staff is committed to making your visit special.`,
    'professional': `${businessName} delivers expert professional services with integrity and excellence. Our team of experienced professionals is dedicated to providing tailored solutions that meet your specific needs. We pride ourselves on our attention to detail, clear communication, and commitment to your success.`,
    'other': `${businessName} is committed to excellence in everything we do. Our dedicated team works tirelessly to provide high-quality products and services that meet the unique needs of our customers. We pride ourselves on our attention to detail, innovative approach, and unwavering commitment to customer satisfaction.`
  };
  
  let baseDescription = categoryDescriptions[category] || 
    `${businessName} is dedicated to providing exceptional products and services to our valued customers. We pride ourselves on our commitment to quality, attention to detail, and outstanding customer service.`;
  
  // Add keywords if provided
  if (keywords) {
    const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k);
    if (keywordArray.length > 0) {
      baseDescription += ` We specialize in ${keywordArray.join(', ')}, and are constantly striving to exceed expectations in these areas.`;
    }
  }
  
  return baseDescription;
}
