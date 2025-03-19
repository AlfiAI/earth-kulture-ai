
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, Book, ExternalLink } from "lucide-react";

const ARIESTrainingResources = () => {
  return (
    <div className="space-y-4">
      <div className="prose max-w-none mb-4">
        <h3 className="text-lg font-medium">ARIES Training Resources</h3>
        <p className="text-muted-foreground">
          Learn how to use ARIES modeling tools effectively for ecosystem assessments and sustainability planning.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Book className="h-5 w-5 mr-2 text-primary" />
              Getting Started
            </CardTitle>
            <CardDescription>Essential resources for beginners</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResourceItem
              title="Introduction to ARIES"
              description="Learn the basics of Artificial Intelligence for Ecosystem Services"
              icon={<FileText className="h-4 w-4" />}
              type="Guide"
            />
            <ResourceItem
              title="Ecosystem Services 101"
              description="Understand the core concepts of ecosystem services assessment"
              icon={<Video className="h-4 w-4" />}
              type="Video"
            />
            <ResourceItem
              title="Model Selection Guide"
              description="How to choose the right model for your assessment needs"
              icon={<FileText className="h-4 w-4" />}
              type="PDF"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Video className="h-5 w-5 mr-2 text-primary" />
              Video Tutorials
            </CardTitle>
            <CardDescription>Step-by-step video instructions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResourceItem
              title="Setting Up Your First Model"
              description="Complete walkthrough of model setup and configuration"
              icon={<Video className="h-4 w-4" />}
              type="Video"
              duration="18:42"
            />
            <ResourceItem
              title="Data Preparation for ARIES"
              description="How to format and import your environmental data"
              icon={<Video className="h-4 w-4" />}
              type="Video"
              duration="12:35"
            />
            <ResourceItem
              title="Interpreting Model Results"
              description="Making sense of your ecosystem service assessment outputs"
              icon={<Video className="h-4 w-4" />}
              type="Video"
              duration="22:10"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Documentation
            </CardTitle>
            <CardDescription>Technical documentation and references</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResourceItem
              title="ARIES Technical Reference"
              description="Comprehensive documentation of all models and parameters"
              icon={<FileText className="h-4 w-4" />}
              type="Technical Doc"
            />
            <ResourceItem
              title="API Documentation"
              description="Guide to integrating ARIES with other systems"
              icon={<FileText className="h-4 w-4" />}
              type="API Guide"
            />
            <ResourceItem
              title="Case Studies Collection"
              description="Real-world applications of ARIES modeling"
              icon={<FileText className="h-4 w-4" />}
              type="PDF Collection"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <ExternalLink className="h-5 w-5 mr-2 text-primary" />
              External Resources
            </CardTitle>
            <CardDescription>Additional learning materials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResourceItem
              title="ARIES Community Forum"
              description="Connect with other users and get help"
              icon={<ExternalLink className="h-4 w-4" />}
              type="Community"
              external={true}
            />
            <ResourceItem
              title="Environmental Modeling Course"
              description="Comprehensive online course on environmental modeling"
              icon={<ExternalLink className="h-4 w-4" />}
              type="Course"
              external={true}
            />
            <ResourceItem
              title="Ecosystem Services Journal"
              description="Latest research on ecosystem services assessment"
              icon={<ExternalLink className="h-4 w-4" />}
              type="Journal"
              external={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface ResourceItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  type: string;
  duration?: string;
  external?: boolean;
}

const ResourceItem = ({ title, description, icon, type, duration, external }: ResourceItemProps) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="bg-primary/10 p-2 rounded-md text-primary">
        {icon}
      </div>
      <div className="space-y-1 flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium text-sm">{title}</h4>
          {duration && <span className="text-xs text-muted-foreground">{duration}</span>}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
            {type}
          </span>
          <Button variant="ghost" size="sm" className="h-6 text-xs">
            {external ? 'Visit' : 'View'}
            {external && <ExternalLink className="ml-1 h-3 w-3" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ARIESTrainingResources;
