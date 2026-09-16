
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { TrendingUp } from 'lucide-react';

import apiClient from '../../../../../config/axiosInsstance';
import Skeleton from '../../../../shared/components/Skeleton';
import AppLayout from '../../../../app/layout/AppLayout';
import Card from '../../../../shared/Card';
import Button from '../../../../shared/components/Button';


 function Dashboard() {
  const navigate = useNavigate();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: async () => {
      const response = await apiClient.get('/analytics/overview');
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-8">
          <Skeleton className="h-32 w-full mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-poppins font-bold text-gray-300 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-600">
            Here's an overview of your customer feedback
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Responses</p>
              <p className="text-4xl font-poppins font-bold text-gray-900">
                {analytics?.totalResponses || 0}
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium mb-2">NPS</p>
              <p className="text-4xl font-poppins font-bold text-recoz-red">
                {analytics?.nps ?? '—'}
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium mb-2">CSAT</p>
              <p className="text-4xl font-poppins font-bold text-gray-900">
                {analytics?.csat ? `${analytics.csat}%` : '—'}
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium mb-2">CES</p>
              <p className="text-4xl font-poppins font-bold text-gray-900">
                {analytics?.ces ? `${analytics.ces}/7` : '—'}
              </p>
            </div>
          </Card>
        </div>

        {/* Sentiment Distribution */}
        {analytics?.sentiments && (
          <Card className="mb-8">
            <h3 className="text-lg font-poppins font-semibold text-gray-900 mb-6">
              Customer Sentiment
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-green-700 font-medium text-sm mb-2">Positive</p>
                <p className="text-3xl font-bold text-green-700">
                  {analytics.sentiments.positive}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 font-medium text-sm mb-2">Neutral</p>
                <p className="text-3xl font-bold text-gray-700">
                  {analytics.sentiments.neutral}
                </p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-red-700 font-medium text-sm mb-2">Negative</p>
                <p className="text-3xl font-bold text-red-700">
                  {analytics.sentiments.negative}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Top Topics */}
        {analytics?.topTopics && analytics.topTopics.length > 0 && (
          <Card className="mb-8">
            <h3 className="text-lg font-poppins font-semibold text-gray-900 mb-6">
              Top Customer Topics
            </h3>
            <div className="space-y-3">
              {analytics.topTopics.map((topic, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium capitalize">{topic.topic}</span>
                  <span className="text-gray-600 text-sm">{topic.count} mentions</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Action */}
        {(!analytics?.totalResponses || analytics.totalResponses === 0) && (
          <Card className="bg-gradient-to-br from-recoz-gray to-white border-2 border-recoz-red border-opacity-20">
            <div className="text-center py-8">
              <TrendingUp size={48} className="mx-auto text-recoz-red mb-4" />
              <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-2">
                No feedback yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first survey to start collecting customer feedback
              </p>
              <Button onClick={() => navigate('/surveys/new')}>
                Create Survey
              </Button>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
export default Dashboard;